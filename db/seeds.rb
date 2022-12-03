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
  
  #create testuser
  you  = Account.where(username: 'du').first_or_initialize(username: 'du')
  you.save(validate: false)
  youId = you.id
  User.where(email: "du@#{domain}").first_or_initialize(email: "du@#{domain}", password: 'mastodondu', password_confirmation: 'mastodondu', confirmed_at: Time.now.utc, account: du, agreement: true, approved: true).save!

  #read file in datasets/covid/test4.0.csv
  csv_text = File.read(Rails.root.join('datasets', 'covid', 'test4.0.csv'))
  #parse file into object
  csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
  counter = 0
  #loop through parsed object
  csv.each do |row|
    #create Account for each column, set username and avatar_remote_url, use counter for different names and pictures
    account  = Account.where(username: "user#{counter}").first_or_initialize(username: "user#{counter}", avatar_remote_url:"https://i.pravatar.cc/150?u=#{counter}")
    #save to databse
    account.save(validate: false)
    #create User for each column, set email, passwort, other variables and created account-variable as account and save to database
    User.where(email: "user#{counter}@#{domain}").first_or_initialize(email: "user#{counter}@#{domain}", password: 'mastodontest', password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, account: account, agreement: true, approved: true).save!
    #create Follow for each column, with the testuser (you) following the newly created account and save to database, increase cration time a bit
    Follow.create(account_id: youId, target_account_id: account.id, created_at: Time.now.utc + counter * 5, updated_at: Time.now.utc + counter * 5)
    #create Status for each column, set the newly created account as account_id and set content of the row named Tweet as text, row Labels as sentiment_score and row Score as polarization_score, converting both to float, increase creation time a bit
    Status.create(account_id: account.id, text: row['Tweet'], created_at: Time.now.utc + counter * 10, updated_at: Time.now.utc + counter * 10, local: true, sentiment_score: row['Labels'].to_f, polarization_score: row['Score'].to_f )
    #increase counter
    counter = counter + 1
  end

end