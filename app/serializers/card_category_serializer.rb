class CardCategorySerializer < ActiveModel::Serializer
  attributes :id, :title, :is_official

  has_many :card_packs
end
