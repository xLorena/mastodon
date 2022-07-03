Doorkeeper::Application.create!(name: 'Web', superapp: true, redirect_uri: Doorkeeper.configuration.native_redirect_uri, scopes: 'read write follow push')

domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain
account = Account.find_or_initialize_by(id: -99, actor_type: 'Application', locked: true, username: domain)
account.save!

if Rails.env.development?
  #create admin
  admin  = Account.where(username: 'admin').first_or_initialize(username: 'admin')
  adminId = admin.id
  admin.save(validate: false)
  User.where(email: "admin@#{domain}").first_or_initialize(email: "admin@#{domain}", password: 'mastodonadmin', password_confirmation: 'mastodonadmin', confirmed_at: Time.now.utc, admin: true, account: admin, agreement: true, approved: true).save!
  #create test1
  test  = Account.where(username: 'test1').first_or_initialize(username: 'test1')
  testId1 = test.id
  test.save(validate: false)
  User.where(email: "test1@#{domain}").first_or_initialize(email: "test1@#{domain}", password: 'mastodontest', password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, admin: false, account: test, agreement: true, approved: true).save!
  #create test2
  testTwo  = Account.where(username: 'test2').first_or_initialize(username: 'test2')
  testId2 = testTwo.id
  testTwo.save(validate: false)
  User.where(email: "test2@#{domain}").first_or_initialize(email: "test2@#{domain}", password: 'mastodontest', password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, admin: false, account: test, agreement: true, approved: true).save!
  #create test3
  testThree  = Account.where(username: 'test3').first_or_initialize(username: 'test3')
  testId3 = testThree.id
  testThree.save(validate: false)
  User.where(email: "test3@#{domain}").first_or_initialize(email: "test3@#{domain}", password: 'mastodontest', password_confirmation: 'mastodontest', confirmed_at: Time.now.utc, admin: false, account: test, agreement: true, approved: true).save!
  #create Follows: admin follows all test accounts
  Follow.where(account_id: adminId).first_or_create(account_id: adminId, target_account_id: testId1, created_at: Time.now.utc, updated_at: Time.now.utc )
  Follow.create(account_id: adminId, target_account_id: testId2, created_at: Time.now.utc, updated_at: Time.now.utc )
  Follow.create(account_id: adminId, target_account_id: testId3, created_at: Time.now.utc, updated_at: Time.now.utc )
  #create status from test1
  status = Status.where(account_id: testId1).first_or_initialize(account_id: testId1, text: "I like cats!", created_at: Time.now.utc + 1, updated_at: Time.now.utc + 1,local: true )
  statusId = status.id
  status.save(validate: false)
  #create reply from admin to status from test1
  Status.create(account_id: adminId, text: "Nice! I am a cat person too.", in_reply_to_id: statusId, created_at: Time.now.utc + 2, updated_at: Time.now.utc + 2)
  #create more status
  Status.create(account_id: testId2, text: "I love dogs.", created_at: Time.now.utc + 1, updated_at: Time.now.utc + 1,local: true )
  Status.create(account_id: testId3, text: "Cats and dogs are equally cute", in_reply_to_id: statusId, created_at: Time.now.utc + 3, updated_at: Time.now.utc + 3)
  Status.create(account_id: testId2, text: "Turtles are cool.", created_at: Time.now.utc - 60, updated_at: Time.now.utc - 60 ,local: true )
  Status.create(account_id: testId3, text: "My favorite animals are sheeps.", created_at: Time.now.utc - 120, updated_at: Time.now.utc - 120 ,local: true )
  Status.create(account_id: testId1, text: "Do you guys like elephants?", created_at: Time.now.utc - 240, updated_at: Time.now.utc - 240 ,local: true )
  Status.create(account_id: adminId, text: "I saw a cute bird today", created_at: Time.now.utc - 240, updated_at: Time.now.utc - 240 ,local: true )
  Status.create(account_id: testId1, text: "Lions are fun", created_at: Time.now.utc - 240, updated_at: Time.now.utc - 240 ,local: true )
end