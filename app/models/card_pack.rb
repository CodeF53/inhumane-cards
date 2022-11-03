class CardPack < ApplicationRecord
  belongs_to :card_category, optional: true

  has_many :white_cards, dependent: :destroy
  has_many :black_cards, dependent: :destroy

  def white_card_hash
    white_cards.map(&:loose_hash)
  end

  def black_card_hash
    black_cards.map(&:loose_hash)
  end
end
