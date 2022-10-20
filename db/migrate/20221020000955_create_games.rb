class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :lobby_leader_id
      t.integer :round_leader_id
      t.string :game_phase
      t.integer :black_card_id
      t.integer :winning_score
      t.integer :max_choose_phase_time
      t.integer :max_pick_phase_time
      t.integer :result_phase_time
      t.integer :hand_size
      t.string :password

      t.timestamps
    end
  end
end
