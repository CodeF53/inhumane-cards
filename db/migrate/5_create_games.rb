class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :winning_score
      t.integer :player_limit
      t.string :password

      t.integer :lobby_owner_id
      t.integer :black_card_id
      t.integer :card_czar_id

      t.string :game_phase, default: 'lobby'

      t.string :state_cache

      t.string :black_card_pool
      t.string :white_card_pool
      t.string :used_white_card_ids
      t.string :used_black_card_ids
    end
  end
end
