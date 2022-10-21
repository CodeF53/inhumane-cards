class User < ApplicationRecord
  has_secure_password

  validates :username, presence: true, uniqueness: { case_sensitive: false }

  belongs_to :game, optional: true

  # makes hand an array somehow
  # https://joecastronovo.medium.com/how-to-add-an-array-column-to-sqlite3-table-662037d49b64
  serialize :hand
  after_initialize do |u|
    u.hand = [] if u.hand.nil?
  end

  # TODO: belongs_to hand_cards, class_name: 'WhiteCard', foreign_keys: 'hand'

  def submitted_card?
    submitted_hand_index.nil?.!
  end

  def submitted_card
    hand[submitted_hand_index]
  end

  def card_czar?
    game.card_czar == self
  end

  def lobby_owner?
    game.lobby_owner == self
  end

  def increment_game_score
    update(game_score: game_score + 1)
  end

  def set_game_vars
    update(game_score: 0, hand: WhiteCard.sample(10))
  end
end
