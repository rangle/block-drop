export const ActivePiece = () => ({
  props: {
    centreX: {
      required: true,
      type: Number,
    },
    centreY: {
      required: true,
      type: Number,
    },
    desc: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    width: {
      required: true,
      type: Number,
    },
    height: {
      required: true,
      type: Number,
    },
    x: {
      required: true,
      type: Number,
    },
    y: {
      required: true,
      type: Number,
    },
  },
  template: `
    <table>
      <caption>{{ name }}</caption>
      <tbody>
        <tr><th>Detail</th><th>X</th><th>Y</th></tr>
        <tr><td>Pos: </td><td>{{ x }}</td><td>{{ y }}</td></tr>
        <tr><td>Centre:</td><td>{{ centreX }}</td><td>{{ centreY }}</td></tr>
        <tr><td>Dimensions:</td><td>{{ height }}</td><td>{{ width }}</td></tr>
        <tr><td colSpan='3'>{{ desc }}</td></tr>
      </tbody>
    </table>
  `,
});
