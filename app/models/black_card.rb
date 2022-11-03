class BlackCard < ApplicationRecord
  belongs_to :card_pack

  def hash
    JSON.parse({ id: id, text: text, pick: pick }.to_json)
  end
end
