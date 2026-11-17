{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.near-frontend;
  near-frontend = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.near-frontend = {
      enable = lib.mkEnableOption "Enable the nextjs app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        example = 3000;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      allowedPools = lib.mkOption {
        type = lib.types.listOf lib.types.str;
        default = [ ];
        example = [ "chainflow.pool.near" "pandateam.poolv1.near" ];
        description = ''
          Full pool ids allowed to use the app. Empty means nothing is allowed.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.near-frontend = {
      wantedBy = [ "multi-user.target" ];
      description = "Nextjs App.";
      after = [ "network.target" ];
      environment = {
        HOSTNAME = cfg.hostname;
        PORT = toString cfg.port;
        ALLOWED_POOLS = lib.concatStringsSep "," cfg.allowedPools;
      };
      serviceConfig = {
        ExecStart = "${lib.getExe near-frontend}";
        DynamicUser = true;
        CacheDirectory = "nextjs-app";
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port ];
    };
  };
}
