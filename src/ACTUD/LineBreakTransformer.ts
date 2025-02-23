export class LineBreakTransformer {
  chunks: string | undefined = "";

  transform(chunk: string, controller: TransformStreamDefaultController) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks!.split("\r");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller: TransformStreamDefaultController) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
