class User < ApplicationRecord
  has_secure_password

  belongs_to :game
  # makes hand an array somehow
  # https://joecastronovo.medium.com/how-to-add-an-array-column-to-sqlite3-table-662037d49b64
  serialize :hand
  after_initialize do |u|
    u.hand = [] if u.hand.nil?
  end

  # TODO: belongs_to hand_cards, class_name: 'WhiteCard', foreign_keys: 'hand'

  def not_chosen_card?
    chosen_hand_index.nil?
  end

  def chosen_card?
    not_chosen_card.!
  end

  def chosen_card
    hand[chosen_hand_index]
  end

  def round_leader?
    game.round_leader == self
  end

  def lobby_leader?
    game.lobby_leader == self
  end

  def increment_game_score
    update(game_score: game_score + 1)
  end

  def set_game_vars
    update(game_score: 0, hand: WhiteCard.sample(game.hand_size))
  end
end
