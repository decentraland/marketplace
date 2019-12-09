package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")

ts_library(
    name = "stableStringify",
    srcs = glob(
        include = [
            "index.ts",
        ],
    ),
    module_name = "dcl/stableStringify",
    deps = [
        "@npm//@types",
    ],
)
