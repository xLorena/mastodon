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
  User.where(email: "du@#{domain}").first_or_initialize(
    email: "du@#{domain}", password: 'mastodondu', 
    password_confirmation: 'mastodondu', 
    confirmed_at: Time.now.utc, account: du, agreement: true, approved: true
    ).save!

  #read file in datasets/covid/test4.0.csv
  csv_text = File.read(Rails.root.join('datasets', 'covid', 'test4.0.csv'))
  #parse file into object
  csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')

  counter = 0
  #loop through parsed object
  csv.each do |row|

    #create Account for each row
    account  = Account.where(username: "user#{counter}").first_or_initialize(
      username: "user#{counter}", 
      avatar_remote_url:"https://i.pravatar.cc/150?u=#{counter}")
    #save to database
    account.save(validate: false)

    #create User for each row
    User.where(email: "user#{counter}@#{domain}").first_or_initialize(
      email: "user#{counter}@#{domain}", password: 'mastodontest', 
      password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, 
      account: account, agreement: true, approved: true
      #save to database
      ).save!

    #create Follow for each row and save to database
    Follow.create(
      #with the testuser (you) following the newly created account
      account_id: youId, 
      target_account_id: account.id, 
      created_at: Time.now.utc + counter * 5, 
      updated_at: Time.now.utc + counter * 5)
      
    #create Status for each row and save to database
    Status.create(
      #with the account that was created in this loop as account_id
      account_id: account.id,
      #set content of column 'Tweet' as text, 
      text: row['Tweet'], 
      created_at: Time.now.utc + counter * 10, 
      updated_at: Time.now.utc + counter * 10,
      #set content of column 'Labels' as sentiment_score, converting to float
      local: true, sentiment_score: row['Labels'].to_f,
      #set content of column 'Score' as polarization_score, converting to float
      polarization_score: row['Score'].to_f )
    counter = counter + 1
  end

end