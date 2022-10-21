class CreateWhiteCards < ActiveRecord::Migration[7.0]
  def change
    create_table :white_cards do |t|
      t.string :text
    end
  end
end
