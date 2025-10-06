{
  description = "AWMusic multi-language development environment (Node.js, Go, Elixir, Gleam)";

  inputs.nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1";

  outputs = inputs:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: inputs.nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.self.overlays.default ];
        };
      });
    in
    {
      overlays.default = final: prev: rec {
        nodejs = prev.nodejs;
        yarn = (prev.yarn.override { inherit nodejs; });
      };

      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            # Node.js ecosystem
            node2nix
            nodejs
            nodePackages.pnpm
            yarn

            # Go
            go
            gopls
            gotools
            go-tools

            # Elixir
            elixir
            elixir-ls

            # Gleam
            gleam
            erlang
            rebar3

            # Development tools
            git
            gh

            # Build tools
            gcc
            gnumake
            pkg-config
          ];

          shellHook = ''
            echo "🎵 AWMusic Development Environment"
            echo ""
            echo "Available languages:"
            echo "  Node.js: $(node --version)"
            echo "  pnpm:    $(pnpm --version)"
            echo "  Go:      $(go version | cut -d' ' -f3)"
            echo "  Elixir:  $(elixir --version | grep Elixir | cut -d' ' -f2)"
            echo "  Gleam:   $(gleam --version)"
            echo ""
            echo "Project structure:"
            echo "  packages/mobile/   - React Native (Expo)"
            echo "  packages/desktop/  - Tauri desktop app"
            echo "  packages/website/  - Astro marketing site"
            echo "  packages/api/      - Backend API (Node.js/Go/Elixir/Gleam)"
            echo "  packages/shared/   - Shared TypeScript types"
            echo ""
            echo "Quick commands:"
            echo "  pnpm install       - Install all dependencies"
            echo "  pnpm dev:mobile    - Start mobile dev server"
            echo "  pnpm dev:api       - Start API server"
            echo "  pnpm clean         - Remove node_modules and lock files"
            echo "  pnpm fresh         - Clean and reinstall"
            echo ""
          '';
        };
      });
    };
}
