class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest

      t.integer :game_id
      t.integer :game_score
      t.integer :submitted_hand_index
      t.integer :picked_card_id
      t.integer :discarded_card_index

      t.integer :last_ping, default: 0
      t.integer :last_input, default: 0 # TODO: use this to auto kick idlers

      t.json :hand, array: true, default: []
    end
  end
end
