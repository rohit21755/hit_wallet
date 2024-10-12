"use client";
import { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";
import { FaRegEye, FaRegEyeSlash, FaClipboard, FaLongArrowAltRight } from "react-icons/fa";
import { encryptSecret } from '../../utils/encryption'
import { saveWalletData } from '../../utils/localStorage';
import CryptoJS from 'crypto-js';
export default function CreateWallet() {
    const [mnemonic, setMnemonic] = useState("");
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        generateNewMnemonic();
    }, []);

    async function generateNewMnemonic() {
        const mn = await generateMnemonic();
        setMnemonic(mn);
    }

    function toggleMnemonicVisibility() {
        setShowMnemonic(!showMnemonic);
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(mnemonic);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }

    const handleNextClick = () => {
        setShowModal(true);
    };

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        const encryptedPhrase = encryptSecret(mnemonic, password);
        const passwordHash = CryptoJS.SHA256(password).toString();
        saveWalletData(encryptedPhrase, passwordHash);
        setShowModal(false); 
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="relative max-w-lg w-full p-1 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500">
                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-4">
                        {mnemonic.split(" ").map((word, index) => (
                            <div
                                key={index}
                                className={`m-1 p-3 rounded-lg text-center transition-all duration-300 ${
                                    showMnemonic
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-700 text-transparent"
                                }`}
                            >
                                <span className="font-semibold">{index + 1}.</span>{" "}
                                {showMnemonic ? word : "••••"}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6">
                        <div className="space-x-2">
                            <button
                                onClick={toggleMnemonicVisibility}
                                className=" text-white  py-2 px-4 rounded transition duration-300"
                            >
                                {showMnemonic ? <FaRegEyeSlash className="inline mr-2" /> : <FaRegEye className="inline mr-2" />}
                                {showMnemonic ? "Hide" : "Show"}
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="text-white py-2 px-4 rounded transition duration-300"
                            >
                                <FaClipboard className="inline mr-2" />
                                Copy
                            </button>
                        </div>
                        <button
                            onClick={handleNextClick}
                            className="text-white font-bold py-2 px-6 rounded transition duration-300"
                        >
                            Next
                            <FaLongArrowAltRight className="inline ml-2" />
                        </button>
                    </div>
                    {copySuccess && (
                        <span className="text-green-400 mt-2 block text-center">
                            Copied to clipboard!
                        </span>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full z-10">
                        <h2 className="text-white text-lg mb-4">Enter a Password</h2>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="p-2 rounded bg-gray-700 text-white w-full"
                            placeholder="Password"
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-300 px-4 py-2 rounded bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="text-white px-4 py-2 rounded bg-purple-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
