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
- [ ] Don't let game start with < 4 players
- [ ] Randomize Pick/Result phase card order
- [ ] Automatically kick players that haven't had a `get /game_state` fetch in 30 seconds
- [ ] Automatically close empty games

<iframe width="400" height="275" src='https://dbdiagram.io/embed/63506e9047094101959cbd7f'> </iframe>

Frontend:
- [x] Home Page
- [x] Log In / Sign Up
- [x] Game Find
- [x] Create Game
- [ ] Game
  - [x] Lobby/Over
  - [x] Submit
  - [x] Pick
  - [x] Result

General:
- [ ] Automatically put user back in game if they are in one
- [ ] Leave Game
- [ ] Kick/Promote
- [ ] Support for cards with `card.pick` > 1
- [ ] Allow picking cart packs
  - [ ] add pack to card seeding
  - [ ] add category to card seeding
    - [x] categories.json (this shit took me 2 hours aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)
- [ ] Settings
  - [ ] Random card rotation optional

## Is this legal?
Cards Against Humanity® is distributed under a [Creative Commons BY-NC-SA 4.0 license](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).