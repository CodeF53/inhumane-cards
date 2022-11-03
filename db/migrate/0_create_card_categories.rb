class CreateCardCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :card_categories do |t|
      t.string :title
      t.boolean :is_official
    end
  end
end
