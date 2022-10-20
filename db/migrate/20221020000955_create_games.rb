class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :lobby_leader_id
      t.integer :round_leader_id
      t.string :game_phase
      t.integer :black_card_id
      t.integer :winning_score, default: 8
      t.integer :max_choose_phase_time, default: 180
      t.integer :max_pick_phase_time, default: 360
      t.integer :result_phase_time, default: 45
      t.integer :hand_size, default: 10
      t.string :password

      t.timestamps
    end
  end
end
