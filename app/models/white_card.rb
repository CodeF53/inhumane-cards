class WhiteCard < ApplicationRecord
  belongs_to :card_pack

  def loose_hash
    JSON.parse({ id: id, text: text }.to_json)
  end
end
