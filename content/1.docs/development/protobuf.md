---
title: Protobuf / gRPC
---


## Deprecating Elements in gRPC

This section is more or less a summary of [Deprecating Elements in gRPC: A Complete Guide by bhanunadar](https://blog.bhanunadar.com/deprecating-elements-in-grpc-a-complete-guide/) with some additions, in one place.

Here's the `deprecated` field option from [the official protobuf documentation](https://protobuf.dev/programming-guides/proto3/):

> `deprecated` (field option): If set to `true`, indicates that the field is deprecated and should not be used by new code. In most languages this has no actual effect. In Java, this becomes a `@Deprecated` annotation. For C++, clang-tidy will generate warnings whenever deprecated fields are used. In the future, other language-specific code generators may generate deprecation annotations on the field’s accessors, which will in turn cause a warning to be emitted when compiling code which attempts to use the field. If the field is not used by anyone and you want to prevent new users from using it, consider replacing the field declaration with a reserved statement.

### Services

```proto
service UserService {
  option deprecated = true;

  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

### Methods

```proto
service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse) {
    option deprecated = true;
  }
}
```

### Messages

```proto
message User {
  option deprecated = true;

  string name = 1;
  int32 age = 2;
}
```

### Message Fields

```proto
message User {
  string name = 1;
  int32 age = 2 [deprecated = true];
}
```

### Enum Values

```proto
enum Data {
  DATA_UNSPECIFIED = 0;
  DATA_SEARCH = 1 [deprecated = true];
  DATA_DISPLAY = 2;
}
```
