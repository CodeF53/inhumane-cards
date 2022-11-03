# Inhumane Cards (Cards Against Humanity Online)
[Pretend You're Xyzzy](https://pyx-1.pretendyoure.xyz/zy/) (online [Cards Against Humanity](https://www.cardsagainsthumanity.com/)), but not garbage.

## About:
Made by [F53](https://f53.dev) for Software Dev School Final Project

Backend: Ruby on Rails

Frontend: React.js

## TODO:
Backend:
- [x] Minimum Viable Database
  - [x] Seed Card Database from [JSON Against Humanity](https://crhallberg.com/cah/)
- [x] Backend game logic clock
- [x] Don't let game start with < 3 players
- [ ] Randomize Pick/Result phase card order
- [x] Fix wrong person getting points
- [x] Automatically kick players that haven't had a `get /game_state` fetch in 30 seconds
- [x] Automatically close empty games
- [ ] Switch to ActionCable and turbo for GameState

<iframe width="400" height="275" src='https://dbdiagram.io/embed/63506e9047094101959cbd7f'> </iframe>

Frontend:
- [x] Home Page
- [x] Log In / Sign Up
- [x] Game Find
- [x] Create Game
- [x] Game
  - [x] Lobby/Over
  - [x] Submit
  - [x] Pick
  - [x] Result
- [ ] Sound Effects
- [ ] Make stuff look good
  - [x] Game Controls Menu
  - [ ] Front Page
  - [ ] Lobby Select Screen
  - [ ] Lobby Create Screen
  - [ ] User Create Screen
- [ ] Everyone is waiting on you
  - the longer everyone is waiting on a single user, the more text appears that says it on their screen
  - after 60 seconds of everyone waiting on a single user, sound effects start to play on their side
- [ ] Waiting on user

General:
- [x] Fix submitted/picked_card_index not resetting
- [ ] Settings
  - [ ] Random card rotation optional
    (3 people have asked for this so far)
  - [ ] Disable everyone is waiting on you sfx
- [ ] Automatically put user back in game if they are in one
- [x] Leave Game
- [x] Kick/Promote
- [ ] Support for cards with `card.pick` > 1
- [x] Allow picking card packs
  - [x] add pack to card seeding
  - [x] add category to card seeding
    - [x] categories.json (this took me 2 hours aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)

## Is this legal?
Cards Against Humanity® is distributed under a [Creative Commons BY-NC-SA 4.0 license](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).