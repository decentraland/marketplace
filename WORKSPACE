workspace(name = "dcl")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_proto",
    sha256 =
        "7994a4587e00b9049fed87390fc0d5ff62e0077c1ae8a0761d618e4dce2c525c",
    strip_prefix = "rules_proto-33549b80b8097502de2a966d764c8d23c59f4d08",
    urls = [
        "https://github.com/bazelbuild/rules_proto/archive/33549b80b8097502de2a966d764c8d23c59f4d08.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()
rules_proto_toolchains()

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "c612d6b76eaa17540e8b8c806e02701ed38891460f9ba3303f4424615437887a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.42.1/rules_nodejs-0.42.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories")

node_repositories(
    node_urls = [
        "https://nodejs.org/dist/v{version}/{filename}",
    ],
    node_version = "10.16.0",
    package_json = ["//:package.json"],
)

load("@build_bazel_rules_nodejs//:defs.bzl", "yarn_install")

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    symlink_node_modules = False,
    yarn_lock = "//:yarn.lock",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

http_archive(
    name = "rules_typescript_proto",
    sha256 = "224a98a044a726f04883392a68a2f0cf0a277dc0d3150f00b71e430ad53f583e",
    strip_prefix = "rules_typescript_proto-ebf191aec9ef0977d7352a6644e9cd91615d3693",
    urls = [
        "https://github.com/Dig-Doug/rules_typescript_proto/archive/ebf191aec9ef0977d7352a6644e9cd91615d3693.tar.gz",
    ],
)

load("@rules_typescript_proto//:index.bzl", "rules_typescript_proto_dependencies")

rules_typescript_proto_dependencies()

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "9bb461d5ef08e850025480bab185fd269242d4e533bca75bfb748001ceb343c3",
    urls = [
        "https://github.com/bazelbuild/rules_webtesting/releases/download/0.3.3/rules_webtesting.tar.gz",
    ],
)

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.1.bzl", "browser_repositories")

browser_repositories(chromium = True)
