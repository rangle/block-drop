export const InputDevice = () => ({
  props: {
    lastKeyCode: {
      required: true,
      type: Number,
    },
  },
  template: `
    <table>
      <caption>Input</caption>
      <tbody>
        <tr><td>{{ lastKeyCode }}</td></tr>
      </tbody>
    </table>
  `,
});
