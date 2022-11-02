def destroy_all_with_progressbar(thing, text)
  entries = thing.all
  progressbar = ProgressBar.create(title: "  #{text}", total: entries.length)
  entries.each do |entry|
    entry.destroy
    progressbar.increment
  end
end

puts '🗑️ Clearing database'
destroy_all_with_progressbar(BlackCard, 'Black Cards')
destroy_all_with_progressbar(WhiteCard, 'White Cards')
destroy_all_with_progressbar(CardPack, 'Card Packs')
destroy_all_with_progressbar(CardCategory, 'Card Categories')

begin
  puts "\n📁 Reading cards file"

  card_file = File.read('./cah-cards-full.json')
rescue Errno::ENOENT
  puts '❌ ./cah-cards-full.json not found!'
  puts 'Download it from https://crhallberg.com/cah/ '
else
  cards_json = JSON.parse(card_file)

  # threads = cards_json.map do |pack|
  cards_json.each do |pack|
    # Thread.new do
    # create the card pack
    card_pack = CardPack.create(title: pack['name'])

    # add cards to the pack
    puts "\n⌛ Loading cards from #{pack['name']}"

    if pack['white'].present?
      progressbar = ProgressBar.create(title: "  #{pack['white'].length} White cards", total: pack['white'].length)

      pack['white'].each do |card|
        WhiteCard.create(text: card['text'], card_pack: card_pack)
        # TODO: save card.pack for something
        progressbar.increment
      end
    end

    next if pack['black'].blank?

    progressbar = ProgressBar.create(title: "  #{pack['black'].length} Black cards", total: pack['black'].length)

    pack['black'].each do |card|
      BlackCard.create(text: card['text'], card_pack: card_pack, pick: card['pick']) if card['pick'] == 1
      # TODO: implement support for cards with card.pick > 1
      progressbar.increment
    end
    # end
  end

  # threads.each do |thread, i|
  #   sleep 0.5 while thread.alive?
  #   puts "finished thread #{i}"
  # end

  # make the categories
  puts "\n🌳 Making categories"
  categories_json = JSON.parse(File.read('./categories.json'))
  categories_json.each do |cat|
    category = CardCategory.create(title: cat['title'], is_official: cat['title'].include?('Official'))

    puts cat['title']
    # Add packs that match cat regex
    cat['regex'].each do |regex|
      CardPack.select { |pack| pack.title.downcase.match(regex.downcase) }.each do |pack|
        puts "\t#{pack.title}"
        pack.update(card_category: category)
      end
    end
  end
end
