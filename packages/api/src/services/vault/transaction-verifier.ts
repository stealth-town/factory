import { Connection, PublicKey, ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { BadRequestError } from '../../errors/AppError'

/**
 * Transaction verifier utility
 * Verifies on-chain transactions match expected structure
 */
export class TransactionVerifier {
	constructor(private connection: Connection) {}

	/**
	 * Verify a token burn transaction (transfer to dead address)
	 * Returns the actual amount burned (after transfer tax)
	 */
	async verifyTokenBurn(
		signature: string,
		expectedFromAccount: PublicKey,
		expectedToAccount: PublicKey,
		expectedOwner: PublicKey,
		minAmount: bigint
	): Promise<bigint> {
		// Fetch transaction from Solana
		const tx = await this.fetchTransaction(signature)

		// Verify transaction is finalized
		if (!tx.meta || tx.meta.err) {
			throw new BadRequestError('Transaction failed or not finalized')
		}

		// Find the transfer instruction
		const transferInstruction = this.findTokenTransferInstruction(
			tx,
			TOKEN_2022_PROGRAM_ID.toBase58()
		)

		if (!transferInstruction) {
			throw new BadRequestError('No token transfer instruction found')
		}

		// Verify accounts
		const parsedInfo = transferInstruction.parsed.info
		if (parsedInfo.source !== expectedFromAccount.toBase58()) {
			throw new BadRequestError('Transfer source account mismatch')
		}
		if (parsedInfo.destination !== expectedToAccount.toBase58()) {
			throw new BadRequestError('Transfer destination account mismatch')
		}
		if (parsedInfo.authority !== expectedOwner.toBase58()) {
			throw new BadRequestError('Transfer authority mismatch')
		}

		// Verify amount (handle string parsing)
		const amountStr = parsedInfo.tokenAmount?.amount || parsedInfo.amount
		if (!amountStr) {
			throw new BadRequestError('Transfer amount not found')
		}

		const actualAmount = BigInt(amountStr)
		if (actualAmount < minAmount) {
			throw new BadRequestError(
				`Transfer amount ${actualAmount} is less than required ${minAmount}`
			)
		}

		return actualAmount
	}

	/**
	 * Verify a SOL transfer transaction
	 * Returns the actual amount transferred
	 */
	async verifySolTransfer(
		signature: string,
		expectedFrom: PublicKey,
		expectedTo: PublicKey,
		minLamports: bigint
	): Promise<bigint> {
		// Fetch transaction from Solana
		const tx = await this.fetchTransaction(signature)

		// Verify transaction is finalized
		if (!tx.meta || tx.meta.err) {
			throw new BadRequestError('Transaction failed or not finalized')
		}

		// Find the system transfer instruction
		const transferInstruction = this.findSolTransferInstruction(tx)

		if (!transferInstruction) {
			throw new BadRequestError('No SOL transfer instruction found')
		}

		// Verify accounts
		const parsedInfo = transferInstruction.parsed.info
		if (parsedInfo.source !== expectedFrom.toBase58()) {
			throw new BadRequestError('Transfer source account mismatch')
		}
		if (parsedInfo.destination !== expectedTo.toBase58()) {
			throw new BadRequestError('Transfer destination account mismatch')
		}

		// Verify amount
		const actualLamports = BigInt(parsedInfo.lamports)
		if (actualLamports < minLamports) {
			throw new BadRequestError(
				`Transfer amount ${actualLamports} lamports is less than required ${minLamports} lamports`
			)
		}

		return actualLamports
	}

	/**
	 * Fetch and parse a transaction from Solana
	 */
	private async fetchTransaction(signature: string): Promise<ParsedTransactionWithMeta> {
		const tx = await this.connection.getParsedTransaction(signature, {
			commitment: 'finalized',
			maxSupportedTransactionVersion: 0,
		})

		if (!tx) {
			throw new BadRequestError('Transaction not found on-chain')
		}

		return tx
	}

	/**
	 * Find a token transfer instruction in a transaction
	 */
	private findTokenTransferInstruction(
		tx: ParsedTransactionWithMeta,
		programId: string
	): ParsedInstruction | null {
		for (const instruction of tx.transaction.message.instructions) {
			// Type guard to check if instruction is ParsedInstruction
			if ('parsed' in instruction) {
				const parsedInstruction = instruction as ParsedInstruction
				if (
					parsedInstruction.programId.toBase58() === programId &&
					(parsedInstruction.parsed.type === 'transfer' ||
						parsedInstruction.parsed.type === 'transferChecked')
				) {
					return parsedInstruction
				}
			}
		}
		return null
	}

	/**
	 * Find a SOL transfer instruction in a transaction
	 */
	private findSolTransferInstruction(tx: ParsedTransactionWithMeta): ParsedInstruction | null {
		for (const instruction of tx.transaction.message.instructions) {
			// Type guard to check if instruction is ParsedInstruction
			if ('parsed' in instruction) {
				const parsedInstruction = instruction as ParsedInstruction
				if (parsedInstruction.program === 'system' && parsedInstruction.parsed.type === 'transfer') {
					return parsedInstruction
				}
			}
		}
		return null
	}
}
