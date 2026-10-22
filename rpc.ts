import { Rpc } from "@opencode/plugin/rpc"

export const RouterRPC = Rpc.define({
  id: "opencode.router-track",
  methods: {
    getValue: {
      input: {},
      output: {
        type: "object",
        properties: { value: { type: ["string", "null"] } },
        required: ["value"],
        additionalProperties: false,
      },
    },
  },
})