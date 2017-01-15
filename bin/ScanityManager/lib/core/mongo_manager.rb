# ./lib/mongo_manager.rb
# Do database operations on mongodb
# Created by : Erenox the : 29/10/2016
# Last update : 29/10/2016

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

    db['results'].find.each do |result|
      result['scanners'].each do |scanner|
        if scanner['status'] == 0
          active_audits << db['audits'].find(result_id: BSON::ObjectId(result['_id'])).first
          break
        end
      end
    end

    db_close(db) # close the database instance

    return active_audits # return point

  end
  #</editor-fold>

  #<editor-fold desc="method : get_audit_keys">
  def self.get_audit_keys(id)

    db = db_open # open a database instance
    audit = db['audits'].find(_id: id).first # get an backups by
    db_close(db) # close the database instance

    if audit
      # get collection _id and foreign keys
      keys = {'_id' => audit['_id'], 'target_id' => audit['target_id'], 'result_id' => audit['result_id']}

      # return backups keys
      return keys

    else
      # return null
      return nil
    end
  end
  #</editor-fold>

  #<editor-fold desc="method : remove_audit(keys)">
  def self.remove_audit(keys)

    db = db_open # open a database instance

    # remove collection audits by _id
    db['audits'].find('_id': BSON::ObjectId(keys['_id'])).delete_one

    # remove collection targets by _id
    db['targets'].find('_id': BSON::ObjectId(keys['target_id'])).delete_one

    # remove collection results by _id
    db['results'].find('_id': BSON::ObjectId(keys['result_id'])).delete_one

    db_close(db) # close the database instance
  end
  #</editor-fold>

  #<editor-fold desc="method : remove_all_audit">
  def self.remove_all_audits

    db = db_open # open a database instance

    # remove audits collection
    db['audits'].drop

    # remove targets collection
    db['targets'].drop

    # remove results collection
    db['results'].drop

    db_close(db) # close the database instance

  end
  #</editor-fold>
  #</editor-fold>

end