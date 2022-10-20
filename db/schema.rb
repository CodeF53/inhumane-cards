# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_10_20_000955) do
  create_table "black_cards", force: :cascade do |t|
    t.string "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "games", force: :cascade do |t|
    t.integer "lobby_leader_id"
    t.integer "round_leader_id"
    t.string "game_phase"
    t.integer "black_card_id"
    t.integer "winning_score"
    t.integer "max_choose_phase_time"
    t.integer "max_pick_phase_time"
    t.integer "result_phase_time"
    t.integer "hand_size"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.integer "game_id"
    t.integer "game_score"
    t.text "hand"
    t.integer "chosen_hand_index"
    t.string "picked_card_index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "white_cards", force: :cascade do |t|
    t.string "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
