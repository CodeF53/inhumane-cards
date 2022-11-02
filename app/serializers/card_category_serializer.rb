class CardCategorySerializer < ActiveModel::Serializer
  attributes :title, :is_official

  has_many :card_packs
end
