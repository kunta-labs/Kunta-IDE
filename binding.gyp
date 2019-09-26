{
  "targets": [
    {
      "target_name": "Language",
      "sources": [ 
               "core/Lang/lexer/lexer.cpp", 
               "core/Lang/lexer/language.cpp", 
               "core/Lang/lexer/ks.cpp",
               "core/Lang/lexer/json.hpp",
               "core/Lang/lexer/symbols.h",
               "core/Lang/lexer/helpers.h",
               "core/Lang/lexer/ast.h"
               ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "core/Lang/lexer/"
      ],
      "cflags!" : [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-rtti",
        "-fno-exceptions"
      ],
      "conditions": [
        [
          "OS==\"mac\"", {
            "xcode_settings": {
              "OTHER_CFLAGS": [
                "-mmacosx-version-min=10.7",
                "-std=c++11",
                "-stdlib=libc++"
              ],
              "GCC_ENABLE_CPP_RTTI": "YES",
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            }
          }
        ]
      ]
    }
  ]
}
