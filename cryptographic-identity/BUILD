package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")

filegroup(
    name = "srcs",
    srcs = glob(
        include = ["**/*.ts"],
        exclude = [
            "node_modules/**/*",
            "**/*.spec.ts",
        ],
    ),
)

ts_library(
    name = "cryptographic-identity",
    srcs = glob(
        include = [
            "**/*.ts",
            "*.ts",
        ],
        exclude = [
            "**/*.spec.ts",
            "*.spec.ts",
        ],
    ),
    module_name = "dcl/cryptographic-identity",
    deps = [
        "//stableStringify",
        "@npm//@types",
        "@npm//@types/node",
        "@npm//ethereum-cryptography",
    ],
)

load("@npm_bazel_jasmine//:index.bzl", "jasmine_node_test")

ts_library(
    name = "cryptographic-identity-spec",
    srcs = glob([
        "*.spec.ts",
        "**/*.spec.ts",
    ]),
    deps = [
        ":cryptographic-identity",
        "//stableStringify",
        "@npm//@types/chai",
        "@npm//@types/jasmine",
        "@npm//@types/node",
        "@npm//chai",
        "@npm//ethereum-cryptography",
    ],
)

jasmine_node_test(
    name = "test",
    coverage = True,
    deps = [
        ":cryptographic-identity-spec",
        "//stableStringify",
        "@npm//jasmine",
    ],
)

