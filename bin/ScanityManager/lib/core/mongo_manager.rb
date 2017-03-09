# ./lib/mongo_manager.rb
# Do database operations on mongodb
# private core gems
require_relative '../core/gems_manager.rb'

# gems
Gems.manage_gems do
  require 'mongo'
end

class Mongodb

  #<editor-fold desc="manage mongodb instance (open & close)">
  #<editor-fold desc="method : db_open">
  def self.db_open
    # Set up the mongo drive output properly
    Mongo::Logger.logger       = ::Logger.new('./logs/mongo.log')
    Mongo::Logger.logger.level = ::Logger::INFO

    # open a mongo session
    return Mongo::Client.new('mongodb://127.0.0.1:27017/scanity')
  end
  #</editor-fold>

  #<editor-fold desc="method : db_close">
  def self.db_close(db)
    db.close
  end
  #</editor-fold>
  #</editor-fold>

  #<editor-fold desc="mongodb queries">
  #<editor-fold desc="method : get_audits">
  def self.get_audits

    db = db_open # open a database instance
    audits = db['audits'].find # get 'backups' collection
    db_close(db) # close the database instance

    return audits

  end
  #</editor-fold>

  #<editor-fold desc="method : get_active_audit">
  def self.get_active_audit

    db = db_open # open a database instance

    active_audits = %w()

    db['audits'].find.each do |audit|
      audit['results'].each do |result|
        if result['status'] == 0
          active_audits << db['audits'].find(_id: BSON::ObjectId(audit['_id'])).first
          break
        end
      end
    end

    db_close(db) # close the database instance

    return active_audits # return point

  end
  #</editor-fold>

  #<editor-fold desc="method : check_audit(keys)">
  def self.check_audit(audit_id)

    db = db_open # open a database instance

    # remove collection audits by _id
    return db['audits'].find('_id': BSON::ObjectId(audit_id))

    db_close(db) # close the database instance

  end
  #</editor-fold>

  #<editor-fold desc="method : remove_audit(keys)">
  def self.remove_audit(audit_id)

    db = db_open # open a database instance

    # remove collection audits by _id
    db['audits'].find('_id': BSON::ObjectId(audit_id)).delete_one

    db_close(db) # close the database instance

  end
  #</editor-fold>

  #<editor-fold desc="method : remove_all_audit">
  def self.remove_all_audits

    db = db_open # open a database instance

    # remove audits collection
    db['audits'].drop

    db_close(db) # close the database instance

  end
  #</editor-fold>

  #</editor-fold>

end
