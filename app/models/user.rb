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

  def hand_cards
    hand.map do |card_id|
      WhiteCard.find_by(card_id)
    end
  end

  def submitted_card?
    submitted_hand_index.nil?.!
  end

  def submitted_card
    hand_cards[submitted_hand_index]
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
    update(game_score: 0, hand: WhiteCard.all.sample(10).map(&:id))
  end
end
