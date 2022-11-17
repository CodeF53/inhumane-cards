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
- [x] Fix wrong person getting points
- [x] Automatically kick players that haven't had a `get /game_state` fetch in 30 seconds
- [x] Automatically close empty games
- [x] Randomize Pick/Result phase card order

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
- [x] Make stuff look good
  - [x] Game Controls Menu
  - [x] Front Page
  - [x] Lobby Select Screen
  - [x] Lobby Create Screen
  - [x] User Create Screen
  - [x] `<input>` elements
- [x] Extra pages
  - [x] About
  - [x] Dev contact
  - [x] Legal
  - [x] Credits
- [ ] Waiting on user
- [ ] Sound Effects
- [ ] Settings
  - [ ] Force Desktop/Mobile rendering
  - [ ] Random card rotation intensity
      (3 people have asked for this so far)
  - [ ] Enable/Disable SFX

General:
- [x] Fix submitted/picked_card_index not resetting
- [x] Leave Game
- [x] Kick/Promote
- [x] Allow picking card packs
  - [x] add pack to card seeding
  - [x] add category to card seeding
    - [x] categories.json (this took me 2 hours aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)
- [x] Discard mode, let users discard one card per turn
- [x] Auto-Leave game after loss of connection
- [x] Automatically rejoin active game
- [x] Auto-Kick users that aren't in the game anymore
  - [ ] Fix edge cases
- [ ] Support for cards with `card.pick` > 1

Future Stretch Goals":
- [x] HTTPS
- [x] Migrate to ActionCable for GameState
- [ ] Switch to Next.js
- [ ] Omni Auth (sign in google and everything)
- [ ] Custom Card Packs (for inside jokes and the like)

## Is this legal?
Cards Against Humanity® is distributed under a [Creative Commons BY-NC-SA 4.0 license](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).