class CreateWhiteCards < ActiveRecord::Migration[7.0]
  def change
    create_table :white_cards do |t|
      t.string :text

      t.belongs_to :card_pack, null: false, foreign_key: true
    end
  end
end
