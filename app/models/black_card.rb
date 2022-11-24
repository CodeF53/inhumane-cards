class BlackCard < ApplicationRecord
  validates :text, presence: true, uniqueness: { case_sensitive: false }

  belongs_to :card_pack

  def loose_hash
    JSON.parse({ id: id, text: text, pick: pick }.to_json)
  end
end
