module.exports = grammar({
  name: "bsn",

  extras: ($) => [/\s+/, $.comment],

  rules: {
    source_file: ($) => repeat1($._entry),

    _entry: ($) => choice(
      $.entity,
      $.inherit_declaration,
      $.name_shorthand,
      $.template_patch,
    ),

    inherit_declaration: ($) => seq(
      ":",
      choice($.string, $.identifier, $.scoped_identifier),
    ),

    scoped_identifier: ($) => seq(
      $.identifier,
      "::",
      $.identifier,
    ),

    entity: ($) => seq(
      choice($.identifier, $.scoped_identifier),
      optional($._entity_modifier),
    ),

    _entity_modifier: ($) => choice(
      $.struct_body,
      $.tuple_body,
      $.block,
    ),

    struct_body: ($) => seq(
      "{",
      optional(repeat(choice(
        $.field_assignment,
        $.entity,
        $.name_shorthand,
        ",",
      ))),
      "}",
    ),

    tuple_body: ($) => seq(
      "(",
      optional(repeat(choice(
        $.entity,
        $.string,
        $.number,
        $.inherit_declaration,
        $.name_shorthand,
        ",",
      ))),
      ")",
    ),

    _struct_entry: ($) => choice(
      $.field_assignment,
      $.entity,
      $.name_shorthand,
    ),

    field_assignment: ($) => seq(
      choice($.identifier, $.scoped_identifier),
      ":",
      $._value,
    ),

    name_shorthand: ($) => seq("#", $.identifier),

    template_patch: ($) => seq(
      "@",
      $.identifier,
      optional($._template_patch_body),
    ),

    _template_patch_body: ($) => choice(
      $.struct_body,
      $.tuple_body,
    ),

    _value: ($) => choice(
      $.string,
      $.number,
      $.entity,
      $.name_shorthand,
    ),

    block: ($) => seq(
      "[",
      optional(commaSep(choice(
        $.entity,
        $.tuple_body,
        $.inherit_declaration,
        $.name_shorthand,
        $.template_patch,
        $.block,
      ))),
      "]",
    ),

    string: ($) => seq(
      '"',
      repeat(/[^"]+/),
      '"',
    ),

    number: ($) => {
      const digit = /[0-9]/;
      const sign = optional(/[-+]/);
      const integer = seq(
        sign,
        optional(digit),
        repeat1(digit),
      );
      const decimal = seq(".", optional(repeat1(digit)));
      return token(seq(
        integer,
        optional(decimal),
        optional(seq(/[eE]/, optional(/[-+]/), repeat1(digit))),
      ));
    },

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: ($) => token(seq("//", /.*/)),
  },
});

function commaSep(rule) {
  return optional(seq(rule, repeat(seq(",", rule)), optional(",")));
}
