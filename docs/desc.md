

  My project is a "game" on solana. In my game, each user has his "generator" that is upgradable and that
  generates money over time (USDC to be specific). Every generator starts the same and has slots for item
  upgrades, users obtain items via gacha system - they burn my $token and they receive item randomly. Users
  can have items stored in inventory, or equipped (thus upgrading the generator). This loop is called "the
  generator" loop. (and generator runtime loop)

  Generator generates money in it's runtime loop. The process starts every day at a certain time (same for
  everyone) and based on the generator attributes, it generates "flux". During the runtime the generator can
  overheat, break down, have a power surge etc. (based on the attributes of it). At the end of the day, all
  the flux thats been generated is pooled, all the USDC thats been aquired is pooled, and the USDC is split
  amongst the users based on how much flux they generated.

  The way users obtain my tokens is either by buying them directly on DEX such as raydium, or via my app, in
  which they buy "balance" (my in-game currency) that they use to mock-trade. Every trade yields my $token
  after it has been completed, regardless of the outcome. This loop is called "factory" loop and is also
  upgradeable (since the factory page / loop has "trade slots" that can be unlocked, for which the user can purchase a factory-engine of a sort (name is abstract) - meaning that he is buying additional ability for one more parallel trade)

  The factory loop acts as a "token shop" because sometimes it will be cheaper to buy the token within the
  app, rather than on the dex. The only caveat of the factory loop is that you have to wait in order to
  obtain the tokens. Flow goes like this:
  - user buys "balance"
  - user picks one of the free buildings in his factory
  - user selects the mode of trade he wishes to perform
  - trade costs X amount of balance.
  - trade is a simulation of a long position with liquidation line - basically if the price of the asset we
  are tracking falls bellow certain line before the trade window ends - you are liquidated
  - if you survived, you get your balance refund, if you dont survive, you dont get it back
  - based on how much time you survived for, you get the amount of tokens (example - if you survived for half
  of the trade time, you get 50% of the total token reward)
  - all trade modes yield the same amount of tokens, but they have different durations

The loops also have their XP system that allows for certain upgrades too.

  So in retrospect - i have 3 main loops:
  1. Generator loop
  2. Generator runtime loop
  3. Factory loop
  (first two loops could also be cnsidered as one big loop)

  My technical approach and the stack involves the following: 
  - Database is supabase hosted solution, i have my migrations located in the ~/packages/db/supabase/migrations. Database also has the supabase js client, and a simple package that is meant to allow me to install it in my other packages for easier access to the DB data.
  - On the backend side, for my main API - i have express and typescript.
  - on the client side, i have a template made of react, some ui libraries, and gill for my solana SDK
  - certain parts of my application will involve autonomous runtimes (such as the generator runtime that will be running on its own, or the entity that will be resolving the trades) - these will also be nodeJS and typescript based, and they will be receiving realtime updates as trigger events from the DB realtime subscription service. They will also have access to the database 



  