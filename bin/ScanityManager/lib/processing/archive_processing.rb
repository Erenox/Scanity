# ./lib/processing/archive_processing.rb
# processing archive operations
# Created by : Erenox the : 02/12/2016
# Last update : 02/12/2016

# private core gems
require_relative '../core/mongo_manager.rb'
require_relative '../core/approval_manager.rb'
require_relative '../core/requirement_manager.rb'

class Archive

  @bin_dir = "#{Dir.pwd}/.."
  @current_dir = Dir.pwd


  #<editor-fold desc="static method : archive_display">
  def self.archive_display

    puts '¤ get audits in database.'
    audits = Mongodb.get_audits

    puts "[ OK ] - #{audits.count} audit(s) found.\n".valid

    audits.each do |audit|

      puts "  id : #{audit['_id']}"
      puts "  target : #{audit['target_main']}"
      puts "  date : #{audit['date']}"
      puts "  private : #{audit['private']}\n\n"

    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : archive_remove(id=nil)">
  def self.archive_remove(id=nil)

    # check id passed in argument
    if id.nil?
      print 'please enter a valid audit id :'
      id = gets.chomp
    end

    #check id validity
    begin
      audit_id = BSON::ObjectId(id)
    rescue
      puts "[ Error ] - invalid audit id. \n".error
      exit(1)
    end

    # get audit foreign keys
    keys = Mongodb.get_audit_keys(audit_id)

    if keys # keys is valid

      # remove audits reference in collection
      puts "\n¤ remove audit : #{audit_id} in database collection."
      Mongodb.remove_audit(keys)
      puts "[ OK ] - audit references removed from database. \n".valid

      # remove audits results in filesystem
      System.exec("remove audit : #{audit_id} results in filesystem.","sudo rm -rf #{@bin_dir}/../public/audits/#{audit_id}", 'audit results removed.','impossible to remove audit results.')

    else# key is invalid

      puts "[ Error ] - invalid audit id. \n".error

    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : archive_remove_all">
  def self.archive_remove_all

    Approval.ask('do you really want to remove all audits')
    
    # remove all backups reference in Database
    puts "\n¤ remove all audits in database collection."
    Mongodb.remove_all_audits
    puts "[ OK ] - all audits references removed from database. \n".valid

    # remove backups results in filesystem
    System.exec('remove all audits results in filesystem.',"sudo rm -rf #{@bin_dir}/../public/audits/*", 'backups results removed.','impossible to remove backups results.')

    # restore the default example audit
    archive_import("#{@current_dir}/backups/defaults.tar.gz")

  end
  #</editor-fold>

  #<editor-fold desc="static method : archive_export">
  def self.archive_export

    # require user approval
    Approval.ask('do you really want to export audits ?')

    # then ask directory
    print 'please set the export base directory : '
    base_dir = gets.chomp

    # remove separator
    if base_dir[-1] == '/'
      base_dir = base_dir[0..-1]
    end

    # check if directory existing
    if File.directory?(base_dir)
      # valid directory
      puts "[ OK ] - the export directory is valid.\n".valid

      # create a date-based export directory
      backup_name = "backup_#{DateTime.now.day}-#{DateTime.now.month}-#{DateTime.now.year}-#{DateTime.now.hour}h#{DateTime.now.min}min#{DateTime.now.sec}sec"
      export_dir = "#{base_dir}/#{backup_name}"
      System.exec('create a export directory',"sudo mkdir #{export_dir}",'export directory created.', 'failed to create export sdirectory.')

      # dump the current state of database
      System.exec('dump the current database',"sudo mongodump --host localhost --port 27017 --db scanity --gzip --out #{export_dir}",'database dumped.','failed to dump database.')

      # copy scanity audits results
      System.exec('copy the audits results',"sudo cp -R #{@bin_dir}/../public/audits #{export_dir}",'audits results copied.','failed to copy audits results.')

      # compress the export directory
      System.exec('compress the export directory.',"sudo tar -P -C #{base_dir} -czvf #{base_dir}/#{backup_name}.tar.gz --remove-files #{backup_name}",'export directory compressed.','failed to compress export directory.')

    else #directory seems invalid
      puts "[ Error ] - invalid directory. \n".error
      exit
    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : archive_import">
  def self.archive_import(compressed_path)

    if compressed_path == nil
      # require user approval
      Approval.ask('do you really want to import and overwrite current audits ?')

      # ask for remove remaining archives
      archive_remove_all

      # then ask the archive path for import
      print 'please set the compressed audits path : '
      compressed_path = gets.chomp

    else
      Requirement.database_start_required

    end

    # check for archive path
    if File.file?(compressed_path)

      # set the environment
      archive_dir = File.dirname(compressed_path)
      archive_path = compressed_path[0..-8]

      # extract the archive.
      System.exec('extract the archive.',"sudo tar xzvf #{compressed_path}  -C #{archive_dir}",'archive is extracted.','failed to extract archive.')

      # restore database state.
      System.exec('restore database state.',"sudo mongorestore --gzip --drop --db scanity --dir #{archive_path}/scanity",'database state is restored.','failed to restore database state.')

      # restore backups data
      System.exec('restore backups data.',"sudo cp -R #{archive_path}/audits/* #{@bin_dir}/../public/audits",'backups data restored.','failed to restore backups data.')

      # remove extracted archive
      System.exec('remove extracted archive.',"sudo rm -rf #{archive_path}",'extracted archive removed.','failed to remove extracted archive.')

    else # not an archive path
      puts "[ Error ] - invalid archive path. \n".error
      exit
    end

  end
  #</editor-fold>

end
