# ./lib/processing/deploy_processing.rb
# processing installation of environment
# Created by : Erenox the : 02/12/2016
# Last update : 16/12/2016

# private core gems
require_relative '../core/system_manager.rb'
require_relative '../core/approval_manager.rb'
require_relative './archive_processing.rb'
require_relative '../core/gems_manager.rb'

# gems
Gems.manage_gems do
  require 'json'
  require 'etc'
end

class Deploy

  # get the current working dir
  @current_dir = Dir.pwd

  #<editor-fold desc="method : set_permissions">
  def self.set_permissions

      # get unix account name of service owner
      print 'Enter a sudoer user defined as service owner, excepting root : '.alert
      service_owner = gets.chomp

      # define and check the service owner unix user
      if system("grep '^#{service_owner}:' /etc/passwd > /dev/null") && service_owner != 'root'
        puts "[ OK ] - service owner found.\n".valid
      else
        puts "[ ERROR ] - service owner must be an existing sudoer, excepting 'root'\n".error
        exit
      end

      # create group of service administrators
      System.exec('create the service administrators unix group.', 'sudo addgroup scanity_operators', 'scanity_operators group created.', 'failed to create scanity_operators group.')

      # chown rights to scanity operators and service owners
      System.exec('set directory owners.', "sudo chown -R #{service_owner}:scanity_operators #{@current_dir}/../../", 'directory owners are set.', 'failed to assign directory owners.')

  end
  #</editor-fold>

  #<editor-fold desc="method : update">
  def self.update
    # update the repository
    System.exec('update system repository.', 'sudo apt-get update', 'update is done.', 'failed to update.')
  end
  #</editor-fold>

  #<editor-fold desc="method : add_repositories">
  def self.add_repositories
    # install mongodb repository key and create a repository file
    System.exec('add mongodb repository key.','sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6','mongodb repository key installed.','failed to install mongodb repository key.')
    System.exec('create source file for mongodb.','sudo echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list','mongodb repository file installed.','fail to install mongodb repository source file.')
  end
  #</editor-fold>

  #<editor-fold desc="method : npm_install_general_module(general_module)">
  def self.npm_install_general_module(general_module)
    # install a required general_module via npm
    System.exec("npm install : #{general_module} as general module.","sudo npm install #{general_module} -g","module : #{general_module} installed." ,"failed to install : #{general_module} general module.")
  end
  #</editor-fold>

  #<editor-fold desc="method : server_package_installer(package)">
  def self.server_package_installer(package)
    # install a required server package via apt
    System.exec("apt install : #{package} service.","sudo apt-get --yes --allow-unauthenticated install #{package}","package : #{package} installed." ,"failed to install : #{package} package.")
  end
  #</editor-fold>

  #<editor-fold desc="method : audit_package_installer(package)">
  def self.audit_package_installer(package)
    # install a required backups tool package via apt
    System.exec("apt install : #{package} audit package.","sudo apt-get --yes install #{package}","audit package : #{package} installed." ,"failed to install : #{package} audit package.")
  end
  #</editor-fold>

  #<editor-fold desc="method : custom_package_installer(package)">
  def self.custom_package_installer(package)
    # install custom private required backups packages via local deb
    System.exec("depack : #{package} onboard package.","sudo apt --yes install #{@current_dir}/custom_packages/#{package}.deb"," onboard package : #{package} installed." ,"failed to install : #{package} onboard package.")
  end
  #</editor-fold>

  #<editor-fold desc="method : bundle_installer(name)">
  def self.bundle_installer(name)
    System.exec("install gems dependencies for : #{name} package.","sudo bundle install --gemfile '/usr/share/#{name}/Gemfile'","gems dependencies for : #{name} installed." ," failed to install : #{name} gems dependencies.")
  end
  #</editor-fold>

  #<editor-fold desc="method : backup_installer(name)">
  def self.backup_installer(name)
    Archive.archive_import("#{@current_dir}/backups/#{name}.tar.gz")
  end
  #</editor-fold>

  #<editor-fold desc="static method : install">
  def self.install

    # initialise
    apt_audit = %w(whatweb nikto nmap sslyze arachni)
    apt_core = %w(nodejs mongodb-org)
    apt_custom = %w(common droopescan joomlavs arachni-profile)
    npm_general_module = %w(forever)
    bundle = %w(joomlavs)

    # set the hostname
    system("sudo bash -c 'echo scanity.net > /etc/hostname'")

    # set the permissions
    set_permissions()

    # add missing repositories
    add_repositories()

    # update the OS repository
    update()

    # install all required service package via apt
    apt_core.each do |package|
      server_package_installer(package)
    end

    # install all required audit tools package via apt
    apt_audit.each do |package|
      audit_package_installer(package)
    end

    # install all audit tools packages via onboard deb
    apt_custom.each do |package|
      custom_package_installer(package)
    end

    # install node general modules via npm
    npm_general_module.each do |general_module|
      npm_install_general_module(general_module)
    end

    # install some missing gems dependencies
    bundle.each do |name|
      bundle_installer(name)
    end

    # install audit example 'defaults'
    backup_installer('defaults')
    
  end
  #</editor-fold>

end
