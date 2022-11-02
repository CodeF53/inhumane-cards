class CardPack < ApplicationRecord
  belongs_to :card_category, optional: true

  has_many :white_cards
  has_many :black_cards
end
