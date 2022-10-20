class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest
      t.integer :game_id
      t.integer :game_score
      t.text :hand, array: true
      t.integer :chosen_hand_index
      t.string :picked_card_index

      t.timestamps
    end
  end
end
