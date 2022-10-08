require 'csv'

Doorkeeper::Application.create!(name: 'Web', superapp: true, redirect_uri: Doorkeeper.configuration.native_redirect_uri, scopes: 'read write follow push')

domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain
account = Account.find_or_initialize_by(id: -99, actor_type: 'Application', locked: true, username: domain)
account.save!

if Rails.env.development?

  #create admin
  admin  = Account.where(username: 'admin').first_or_initialize(username: 'admin')
  admin.save(validate: false)
  adminId = admin.id
  User.where(email: "admin@#{domain}").first_or_initialize(email: "admin@#{domain}", password: 'mastodonadmin', password_confirmation: 'mastodonadmin', confirmed_at: Time.now.utc, admin: true, account: admin, agreement: true, approved: true).save!


  csv_text = File.read(Rails.root.join('datasets', 'covid', 'test4.0.csv'))
  csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
  counter = 0
  csv.each do |row|
    puts row.to_hash
    account  = Account.where(username: "user#{counter}").first_or_initialize(username: "user#{counter}")
    account.save(validate: false)
    User.where(email: "user#{counter}@#{domain}").first_or_initialize(email: "user#{counter}@#{domain}", password: 'mastodontest', password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, account: account, agreement: true, approved: true).save!
    Follow.create(account_id: adminId, target_account_id: account.id, created_at: Time.now.utc + counter * 5, updated_at: Time.now.utc + counter * 5)
    Status.create(account_id: account.id, text: row['Tweet'], created_at: Time.now.utc + counter * 10, updated_at: Time.now.utc + counter * 10, local: true, sentiment_score: row['Labels'].to_f, polarization_score: row['Score'].to_f )
    counter = counter + 1
  end

end