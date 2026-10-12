//#region node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
	return regex.exec(string)?.groups;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
var tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
/**
* Formats {@link AbiParameter} to human-readable ABI parameter.
*
* @param abiParameter - ABI parameter
* @returns Human-readable ABI parameter
*
* @example
* const result = formatAbiParameter({ type: 'address', name: 'from' })
* //    ^? const result: 'address from'
*/
function formatAbiParameter(abiParameter) {
	let type = abiParameter.type;
	if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
		type = "(";
		const length = abiParameter.components.length;
		for (let i = 0; i < length; i++) {
			const component = abiParameter.components[i];
			type += formatAbiParameter(component);
			if (i < length - 1) type += ", ";
		}
		const result = execTyped(tupleRegex, abiParameter.type);
		type += `)${result?.array || ""}`;
		return formatAbiParameter({
			...abiParameter,
			type
		});
	}
	if ("indexed" in abiParameter && abiParameter.indexed) type = `${type} indexed`;
	if (abiParameter.name) return `${type} ${abiParameter.name}`;
	return type;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
/**
* Formats {@link AbiParameter}s to human-readable ABI parameters.
*
* @param abiParameters - ABI parameters
* @returns Human-readable ABI parameters
*
* @example
* const result = formatAbiParameters([
*   //  ^? const result: 'address from, uint256 tokenId'
*   { type: 'address', name: 'from' },
*   { type: 'uint256', name: 'tokenId' },
* ])
*/
function formatAbiParameters(abiParameters) {
	let params = "";
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		params += formatAbiParameter(abiParameter);
		if (i !== length - 1) params += ", ";
	}
	return params;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
/**
* Formats ABI item (e.g. error, event, function) into human-readable ABI item
*
* @param abiItem - ABI item
* @returns Human-readable ABI item
*/
function formatAbiItem(abiItem) {
	if (abiItem.type === "function") return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
	if (abiItem.type === "event") return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "error") return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "constructor") return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	if (abiItem.type === "fallback") return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	return "receive() external payable";
}
//#endregion
export { formatAbiItem as t };
