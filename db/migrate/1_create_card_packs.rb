class CreateCardPacks < ActiveRecord::Migration[7.0]
  def change
    create_table :card_packs do |t|
      t.string :title
      
      t.belongs_to :card_category, null: false, foreign_key: true
    end
  end
end
