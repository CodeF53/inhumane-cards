class CreateBlackCards < ActiveRecord::Migration[7.0]
  def change
    create_table :black_cards do |t|
      t.string :text
      t.integer :pick, default: 1

      t.belongs_to :card_pack, null: false, foreign_key: true
    end
  end
end
