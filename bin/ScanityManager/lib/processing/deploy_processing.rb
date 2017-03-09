# ./lib/processing/deploy_processing.rb
# processing installation of environment

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
      print 'enter a sudoer user defined as service owner, excepting root : '.alert
      service_owner = gets.chomp

      # define and check the service owner unix user
      if system("grep '^#{service_owner}:' /etc/passwd > /dev/null") && service_owner != 'root'
        puts "[ OK ] - service owner found.\n".valid
      else
        puts "[ ERROR ] - service owner must be an existing sudoer, excepting 'root'\n".error
        exit
      end

      # create group of service administrators
      System.exec('create the service admins unix group.', 'sudo addgroup scanity_operators', 'scanity_operators group created.', 'failed, scanity_operators group already exist.')

      # chown rights to scanity operators and service owners
      System.exec('assign the service owners rights.', "sudo chown -R #{service_owner}:scanity_operators #{@current_dir}/../../", 'directory owners are set.', 'failed to assign directory owners.')

  end
  #</editor-fold>

  #<editor-fold desc="method : pre_install ">
  def self.pre_install

    #update and install required packages
    System.exec('install the required packages.','(apt-get update && apt-get --yes install build-essential gnome-system-tools gcc make sudo curl git chrpath libssl-dev libxft-dev libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev libcurl3 libcurl4-openssl-dev ruby ruby-dev phantomjs python-pip)','required packages installed.','fail to install required packages.')

  end
  #</editor-fold>

  #<editor-fold desc="method : post_install ">
  def self.post_install
    # fix : Bug 817277: phantomjs: PhantomJS fails to run headless
    system('sed -i "3 a export QT_QPA_PLATFORM=offscreen" /usr/bin/phantomjs')
  end
  #</editor-fold>

  #<editor-fold desc="method : install_mongodb ">
  def self.install_mongodb
    # install mongodb using mongodb3.4.sh
    System.exec('install mongodb 3.4',"bash #{@current_dir}/lib/install_scripts/mongo3.4.sh",'mongodb installed.','failed to install mongodb.')
  end
  #</editor-fold>

  #<editor-fold desc="method : install_nodejs ">
  def self.install_nodejs
    # install node.js using nodejs7.7.1.sh
    System.exec('install node.js v7.7.1 ',"bash #{@current_dir}/lib/install_scripts/nodejs7.7.1.sh",'node.js installed','failed to install node.js.')
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
    System.exec("depack : #{package} onboard package.","sudo apt --yes install #{@current_dir}/custom_packages/#{package}.deb","onboard package : #{package} installed." ,"failed to install : #{package} onboard package.")
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
    apt_custom = %w(common droopescan joomlavs arachni-profile)
    npm_general_module = %w(forever)

    bundle = %w(joomlavs)

    # set the hostname
    system("sudo bash -c 'echo scanity.net > /etc/hostname'")

    # set the permissions
    set_permissions

    # to do over installation
    pre_install

    # install mongodb
    install_mongodb

    # install nodejs
    install_nodejs

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

    # to do after installation
    post_install


    # install audit example 'defaults'
    backup_installer('defaults')

  end
  #</editor-fold>

end
