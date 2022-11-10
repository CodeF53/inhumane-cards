class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :winning_score
      t.integer :player_limit
      t.boolean :enable_discards, default: false
      t.string :password

      t.integer :lobby_owner_id
      t.integer :black_card_id
      t.integer :card_czar_id

      t.string :game_phase, default: 'lobby'

      t.json :black_card_pool, array: true, default: []
      t.json :white_card_pool, array: true, default: []
      t.integer :used_white_card_ids, array: true, default: []
      t.integer :used_black_card_ids, array: true, default: []
    end
  end
end
