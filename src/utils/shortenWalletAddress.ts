export function shortenWalletAddress(address: string, characters?: number) {
  let char = 4;

  if (characters != null) {
    char = characters;
  }

  if (address == null || address.length < char * 2) {
    return 'UN...KNOWN';
  }

  const first = address.substring(0, char);
  const second = address.substring(address.length - char, address.length);

  return `${first}...${second}`;
}
