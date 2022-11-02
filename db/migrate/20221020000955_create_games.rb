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
    end
  end
end
