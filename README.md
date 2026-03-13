# Oxidation Compiler Config Inspector(oxc-inspector)

A visual tool for inspecting and understanding your oxlint and oxfmt config.

<img width="3600" height="2252" alt="Screenshot 1" src="https://github.com/user-attachments/assets/97006127-7a58-4d39-b156-52a6ea20936d" />
<img width="1252" alt="Screenshot 2" src="https://github.com/user-attachments/assets/72191307-b3eb-413a-baab-465721a6e735">
<img width="1362" alt="Screenshot 3" src="https://github.com/user-attachments/assets/d08e0198-2273-4e99-851b-20976c4cf731">

## Usage

### Local Development

Run in your project root directory containing `.oxlintrc.json`:

```bash
npx oxrc-inspector
```

Visit http://localhost:7777 to view your configuration.

### Static Build

Generate static pages (output to `.oxrc-inspector` directory):

```bash
npx oxrc-inspector build
```

## License

MIT License

## Acknowledgments

This project is inspired by and built upon the excellent work of:

- **[eslint/config-inspector](https://github.com/eslint/config-inspector)** - For providing the foundational concept and implementation of ESLint configuration inspection
- **[Oxc](https://github.com/oxc-project/oxc)** - For providing the powerful oxlint and oxfmt tools that this project visualizes and helps understand
